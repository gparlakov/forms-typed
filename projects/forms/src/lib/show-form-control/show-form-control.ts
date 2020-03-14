export const componentSelector = 'fty-show-form-control';

export interface WindowWidthProvider {
  innerWidth: number;
  innerHeight: number;
}
export interface WindowAnimationFrameProvider {
  requestAnimationFrame(cb: any): any;
}
