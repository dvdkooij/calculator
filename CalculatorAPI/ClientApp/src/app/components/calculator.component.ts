/*************************************************************************************************
* globale uitleg calculator component.
* component verwerkt een button-click. 
* er vormt zich een stack waarin elk item op de stack een operand of een operator is, 
* currentOperand is de variabele waarin een operand wordt bewerkt.
* als een operator wordt ingevoerd wordt de currentOperand op de stack geplaatst.
* de stack kan worden opgevraagd als infix die aan de calculater API aangeboden kan worden
*
* Een text input is nu niet beschikbaar. De extra code die dat oplevert is:
* 1 beperken van mogelijke keystrokes tot operators en operands
* 2 check of keystroke operand/operator,backbutton of resultaat (= of enter is)
* 3 aanroepen van de juiste functie (processOperand, processOperator, procesBack, processResult)
**************************************************************************************************/
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Stack } from "../common/n-stack";
import { CalculationDto } from '../dto/CalculationDto';
import { ICalculationDto } from '../dto/ICalculationDto';
import { CalculatorService } from "../services/calculator.service";

const maxLengthCalculation: number = 50;

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  calculatorForm: FormGroup;
  currentOperand: string = '';
  calculationStack = new Stack<string>();
  toggleSign: number = 1;
  errorMessage = '';
  calculationResult: ICalculationDto | undefined;


  //get de stack van operators en operands inclusief het nog niet weggeschreven currentOperand
  get infix() {
    if (this.currentOperand)
      return (this.calculationStack.join() + ' ' + this.currentOperand).trim();
    else
      return this.calculationStack.join().trim();
  }

  get resultFromCalculationResult() {
    if (this.calculationResult && this.calculationResult.result) {
      return this.calculationResult.result
    }
    return '';
  }

  get postFixFromCalculationResult() {
    if (this.calculationResult) {
      return this.calculationResult.postfix + "=";
    }
    return '';
  }

  constructor(private calculatorService: CalculatorService) {
  }

  toggleSignClickEvent() {
    this.toggleSign = this.toggleSign * -1;
    this.currentOperand = this.applySign(this.currentOperand);
  }

  operandClickEvent(value: string) {
    this.processOperand(value);
  }

  operatorClickEvent(value: string) {
    this.processOperator(value);
  }

  backClickEvent() {
    this.processBack();
  }

  clearClickEvent() {
    this.currentOperand = null;
    this.toggleSign = 1;
    this.calculationStack = new Stack<string>();
    this.errorMessage = '';
    this.calculationResult = null;
  }

  calculateClickEvent() {
    this.processCalculation();
  }

  processCalculation(): void {
    this.errorMessage = '';
    var calculationRequest = new CalculationDto();
    calculationRequest.infix = this.infix;
    this.calculatorService.calculate(calculationRequest).subscribe({
      next: calculation => this.calculationResult = calculation,
      error: err => {
        console.log(err);
        this.errorMessage = err
      }
    });
  }

  processOperator(value: string): void {
    if (this.currentOperand) {
      this.calculationStack.push(this.currentOperand);
      this.currentOperand = null;
    }

    if (this.validateOperator(value))
      this.calculationStack.push(value);
    if (!this.validateCalculationLength(this.infix))
      this.errorMessage = "Head spinning, calculation too long"
  }

  processOperand(value: string): void {
    if (!this.validateOperand(value))
      return;

    if (this.currentOperand)
      this.currentOperand += value;
    else
      this.currentOperand = value;

    this.currentOperand = this.addLeadZero(this.currentOperand);
    this.currentOperand = this.applySign(this.currentOperand);

    if (!this.validateCalculationLength(this.infix))
      this.errorMessage = "Head spinning, calculation too long"
  }

  processBack(): void {
    // checken of er een currentOperand is anders van de stack halen
    if (!this.currentOperand && this.calculationStack.peek())
      this.currentOperand = this.calculationStack.pop();

    //verwijder het laatste karakter als de lengte > 1 
    if (this.currentOperand.length > 1)
      this.calculationStack.push(this.currentOperand.slice(0, -1));

    this.currentOperand = null;
  }

  isOperator(value: string): boolean {
    return value === "*" ||
      value === "+" ||
      value === "-" ||
      value === "/";
  }

  isBracketOpen(value: string): boolean {
    return value === "("
  }

  isBracketClose(value: string): boolean {
    return value === ")"
  }

  isOperand(value: string): boolean {
    return value && !isNaN(+value);
  }

  isDecimalSeperator(value: string): boolean {
    return value && value === ".";
  }

  containsDecimalSeperator(value: string): boolean {
    return value && value.indexOf(".") > -1;
  }

  validateOperator(value: string): boolean {
    //laten we niet beginnen met een operator tenzij het haakje openen is.    
    var previousValue = this.calculationStack.peek();
    if ((!previousValue && !this.isBracketOpen(value)))
      return false;

    //een haakje openen mag niet volgen op een operand
    if (previousValue && this.isOperand(previousValue) && this.isBracketOpen(value))
      return false;

    //een operator mag niet volgen na een haakjeopenen tenzij het een haakje openen is
    if (previousValue && this.isBracketOpen(previousValue) &&
      (this.isOperator(value) && !this.isBracketOpen(value)))
      return false;

    //na een operator mag niet volgen een operator, meerdere haakjes sluiten achter elkaar mag wel    
    if (previousValue && this.isOperator(previousValue) &&
      (this.isOperator(value) && !this.isBracketClose(value)))
      return false;

    //na een haakje sluiten mag er niet een operand
    if (previousValue && this.isBracketClose(previousValue) &&
      (this.isOperand(value) && !this.isBracketClose(value)))
      return false;

    return true;
  }

  validateOperand(value: string): boolean {
    if (this.isDecimalSeperator(value)) {
      var previousValue = this.calculationStack.peek();

      //een punt mag maar een keer in currentOperand     
      if (this.containsDecimalSeperator(this.currentOperand))
        return false;

      //als de value een punt is moet de vorige waarde op de stack een operator zijn, 
      //een haakje open, of de stack moet leeg zijn,
      if (previousValue && !this.isBracketOpen(previousValue) && !previousValue)
        return false;

      //een haakje sluiten als vorige mag ook niet.
      if (previousValue && this.isBracketClose(previousValue))
        return false;
    }

    return true;
  }

  //een calculatie mag een maximale lengte van 50 hebben 
  validateCalculationLength(value: string): boolean {
    return this.infix && this.infix.length <= maxLengthCalculation;
  }


  //in geval van starten met decimaal even een lead zero toevoegen
  addLeadZero(value: string): string {
    if (value.startsWith("."))
      return "0" + value;
    return value;
  }

  //+ of - sign van een value toggelen, rekening houden met 0. waarden
  applySign(value: string): string {
    var result = value;
    if (value) {
      if (!value.endsWith('.')) {
        try {
          result = (Number(this.currentOperand) * this.toggleSign).toString();
        }
        catch {
          this.errorMessage = "Too big to fit in number";
          result = '0';
        }
      }
      else {
        if (value.endsWith('.') && value.startsWith('-') && this.toggleSign === -1) {
          result = value.substring(1);
        }
        else if (value.endsWith('.') && this.toggleSign === -1) {
          result = "-" + value;
        }
      }
    }
    this.toggleSign = 1;
    return result;
  }
}
