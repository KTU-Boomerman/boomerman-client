import { IVisitor } from "./IVisitor";

export interface IManager {
    accept: (visitor: IVisitor) => void;
}