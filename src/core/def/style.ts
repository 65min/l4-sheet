export interface Style {
  fillStyle?: string | CanvasGradient | CanvasPattern;
  strokeStyle?: string | CanvasGradient | CanvasPattern;
  font?: string;
  fontKerning?: CanvasFontKerning;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
}
