export type Coord = {
  x: number;
  y: number;
  w: number;
  h: number;
}
export default interface ModuleInterface {
  id: number;
  coord: Coord
}
