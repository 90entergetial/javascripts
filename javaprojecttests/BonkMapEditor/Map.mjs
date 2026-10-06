import { encodeToDatabase } from "./encodeToDatabase.mjs";
import { CapZone } from "./CapZone.mjs";
import { decodeFromDatabase } from "./decodeFromDatabase.mjs";
import { MapInfo } from "./MapInfo.mjs";
import { Physics } from "./Physics.mjs";
import { Settings } from "./Settings.mjs";
import { Spawn } from "./Spawn.mjs";
import { Shape } from "./Shape.mjs";

const SVG_STROKE = 'rgba(255, 255, 255, 0.8)';

function svgNumber(value) {
    return Number.isFinite(value) ? String(value) : '0';
}

function svgRotation(radians) {
    return svgNumber(radians * 180 / Math.PI);
}

export class Map {

    static offScreenCanvas = new OffscreenCanvas(1, 1);

    constructor() {
        this.version = 15;
        this.settings = new Settings();
        this.physics = new Physics();
        this.spawns = [];
        this.capZones = [];
        this.mapInfo = new MapInfo();
    }

    async exportCanvas(height = 500) {
        const off = new OffscreenCanvas(height * 730 / 500, height);
        const offCtx = off.getContext('2d');
        await this.draw(offCtx, height, 0, 0, 1);
        return off;
    }

    async exportBlob(height = 500) {
        const canvas = await this.exportCanvas(height);
        return await canvas.convertToBlob({ type: 'image/png' });
    }

    exportSVG(height = 500) {
        const width = height * 730 / 500;
        const centerX = width / 2;
        const centerY = height / 2;
        const mapScale = height / 500;
        const elements = [
            `<rect width="${svgNumber(width)}" height="${svgNumber(height)}" fill="#34495e"/>`,
            `<g transform="translate(${svgNumber(centerX)} ${svgNumber(centerY)}) scale(${svgNumber(mapScale)})">`
        ];

        for (let i = this.physics.bodyRenderOrder.length - 1; i >= 0; i--) {
            const body = this.physics.bodies[this.physics.bodyRenderOrder[i]];
            if (!body) continue;

            elements.push(
                `<g transform="translate(${svgNumber(body.position.x)} ${svgNumber(body.position.y)}) rotate(${svgRotation(body.angle)})">`
            );

            for (const fixtureIndex of body.fixtureIndices) {
                const fixture = this.physics.fixtures[fixtureIndex];
                const shape = fixture && this.physics.shapes[fixture.shapeIndex];
                if (!shape) continue;

                const isCapZone = this.capZones.some(cz => cz.shapeIndex == fixture.shapeIndex);
                const fill = `#${fixture.color.toString(16).padStart(6, '0')}`;
                const paint = isCapZone
                    ? `fill="none" stroke="${SVG_STROKE}" stroke-width="3"`
                    : `fill="${fill}"`;

                elements.push(
                    `<g transform="translate(${svgNumber(shape.position.x)} ${svgNumber(shape.position.y)})">`
                );

                switch (shape.type) {
                    case Shape.TYPE.BOX:
                        elements.push(
                            `<rect x="${svgNumber(-shape.width / 2)}" y="${svgNumber(-shape.height / 2)}" width="${svgNumber(shape.width)}" height="${svgNumber(shape.height)}" transform="rotate(${svgRotation(shape.angle)})" ${paint}/>`
                        );
                        break;
                    case Shape.TYPE.CIRCLE:
                        elements.push(
                            `<circle cx="0" cy="0" r="${svgNumber(shape.radius)}" ${paint}/>`
                        );
                        break;
                    case Shape.TYPE.POLYGON:
                        if (shape.vertices.length > 0) {
                            const points = shape.vertices
                                .map(vertex => `${svgNumber(vertex.x)},${svgNumber(vertex.y)}`)
                                .join(' ');
                            elements.push(
                                `<polygon points="${points}" transform="rotate(${svgRotation(shape.angle)}) scale(${svgNumber(shape.scale)})" ${paint}/>`
                            );
                        }
                        break;
                }

                elements.push('</g>');
            }

            elements.push('</g>');
        }

        for (const spawn of this.spawns) {
            elements.push(
                `<circle cx="${svgNumber(centerX + spawn.x * mapScale)}" cy="${svgNumber(centerY + spawn.y * mapScale)}" r="${svgNumber(this.physics.partsPerMeter * mapScale)}" fill="#D32F2F"/>`
            );
        }

        elements.push('</g>');
        return new Blob([
            `<svg xmlns="http://www.w3.org/2000/svg" width="${svgNumber(width)}" height="${svgNumber(height)}" viewBox="0 0 ${svgNumber(width)} ${svgNumber(height)}">${elements.join('')}</svg>`
        ], { type: 'image/svg+xml' });
    }

    async download(height = 500, filename = 'map.png') {
        const blob = filename.toLowerCase().endsWith('.svg')
            ? this.exportSVG(height)
            : await this.exportBlob(height);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    async draw(ctx, height = 500, offsetX = 0, offsetY = 0, scale = 1, noborder = false) {
        if(noborder) height = height * 10;
        let width = 730 / 500 * height;
        const cx = ctx.canvas.width / 2;
        const cy = ctx.canvas.height / 2;
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        ctx.beginPath();
        ctx.rect(cx - width / 2, cy - height / 2, width, height);
        ctx.clip();
        if(noborder) height = height / 10;
        if(noborder) width = 730 / 500 * height;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#34495e';
        if(noborder) ctx.fillStyle = '#1E3246';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();

        ctx.translate(cx, cy);
        ctx.scale(height / 500, height / 500);

        this.physics.draw(ctx, this);
        for (const spawn of this.spawns) {
            spawn.shadow(ctx, this);
        }
        for (const spawn of this.spawns) {
            spawn.draw(ctx, this);
        }

        ctx.restore();
    }

    static toHexString(color) {
        return `#${color.toString(16).padStart(6, '0')}`;
    }

    toJSON() {
        return {
            v: this.version,
            s: this.settings.toJSON(),
            physics: this.physics.toJSON(),
            spawns: this.spawns.map(s => s.toJSON()),
            capZones: this.capZones.map(cz => cz.toJSON()),
            m: this.mapInfo.toJSON()
        }
    }

    static fromJSON(json) {
        const map = new Map();
        map.version = json.v ?? 15;
        map.settings = Settings.fromJSON(json.s);
        map.physics = Physics.fromJSON(json.physics);
        map.spawns = (json.spawns ?? []).map(s => Spawn.fromJSON(s));
        map.capZones = (json.capZones ?? []).map(cz => CapZone.fromJSON(cz));
        map.mapInfo = MapInfo.fromJSON(json.m ?? {});
        return map;
    }

    static fromString(str) {
        return Map.fromJSON(decodeFromDatabase(str));
    }

    toString(){
        return encodeToDatabase(this.toJSON());
    }

}