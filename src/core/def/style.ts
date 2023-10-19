export interface Style {
  fillStyle?: string | CanvasGradient | CanvasPattern;
  strokeStyle?: string | CanvasGradient | CanvasPattern;
  lineWidth?: number;
  font?: string;
  fontKerning?: CanvasFontKerning;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;

  lineJoin?: CanvasLineJoin;
}
