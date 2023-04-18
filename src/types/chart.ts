export interface IChartSVG {
  width: number;
  height: number;
}

export interface IBaseData {
  name: string;
  /* eslint-disable-next-line */
  value: any;
}

export interface IMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface IXY {
  x: number;
  y: number;
}

export interface BarValue {
  name: string;
  value: number;
}

export type TColor = string;
