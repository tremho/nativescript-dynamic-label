export interface Bounds {
  width: number;
  height: number;
}

export interface RenderedSize {
  width: number;
  height: number;
  textSize: number;
}

// records text spans per line break
export interface LineInfo {
  text: string;
  left: number;
}

export interface FitResults {
  width: number;
  height: number;
  lines: LineInfo[];
  wasCut: boolean;
}
