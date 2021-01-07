/* eslint-disable @typescript-eslint/ban-ts-comment */
const VERSION = __PIXI_VERSION__;
export * from '@pixi/app';
export * from '@pixi/constants';
export * from '@pixi/core';
export * from '@pixi/display';
export * from '@pixi/graphics';
export * from '@pixi/loaders';
export * from '@pixi/math';
export * from '@pixi/mesh';
export * from '@pixi/mesh-extras';
export * from '@pixi/runner';
export * from '@pixi/settings';
export * from '@pixi/sprite';
export * from '@pixi/sprite-animated';
export * from '@pixi/spritesheet';
export * from '@pixi/ticker';
import * as interaction from '@pixi/interaction';
import * as utils from '@pixi/utils';
export { interaction };
export { utils };
export { VERSION };
import '@pixi/mixin-get-child-by-name';
// Application plugins
import { Application } from '@pixi/app';
// Renderer plugins
// @ts-ignore
import { BatchRenderer, Renderer } from '@pixi/core';
import { AppLoaderPlugin, Loader } from '@pixi/loaders';
import { SpritesheetLoader } from '@pixi/spritesheet';
import { TickerPlugin } from '@pixi/ticker';

// @ts-ignore
Application.registerPlugin(AppLoaderPlugin);
Renderer.registerPlugin('batch', BatchRenderer);
// @ts-ignore
Renderer.registerPlugin('interaction', interaction.InteractionManager);
// @ts-ignore
Application.registerPlugin(TickerPlugin);
Loader.registerPlugin(SpritesheetLoader);

import '@pixi/canvas-display';
export * from '@pixi/canvas-renderer';
export * from '@pixi/canvas-extract';
export * from '@pixi/canvas-sprite';
export * from '@pixi/canvas-mesh';
export * from '@pixi/canvas-graphics';
export * from '@pixi/canvas-prepare';

// CanvasRenderer plugins
import { CanvasRenderer } from '@pixi/canvas-renderer';
import { CanvasExtract } from '@pixi/canvas-extract';
// @ts-ignore
CanvasRenderer.registerPlugin('extract', CanvasExtract);
import { CanvasGraphicsRenderer } from '@pixi/canvas-graphics';
// @ts-ignore
CanvasRenderer.registerPlugin('graphics', CanvasGraphicsRenderer);
import { CanvasMeshRenderer } from '@pixi/canvas-mesh';
// @ts-ignore
CanvasRenderer.registerPlugin('mesh', CanvasMeshRenderer);
import { CanvasPrepare } from '@pixi/canvas-prepare';
// @ts-ignore
CanvasRenderer.registerPlugin('prepare', CanvasPrepare);
import { CanvasSpriteRenderer } from '@pixi/canvas-sprite';
// @ts-ignore
CanvasRenderer.registerPlugin('sprite', CanvasSpriteRenderer);
// @ts-ignore
CanvasRenderer.registerPlugin('interaction', interaction.InteractionManager);
