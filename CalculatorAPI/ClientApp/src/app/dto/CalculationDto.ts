import { ICalculationDto } from './ICalculationDto';

export class CalculationDto implements ICalculationDto {
  public infix: string;
  public postfix?: string;
  public result?: number;

  constructor() { }
}
