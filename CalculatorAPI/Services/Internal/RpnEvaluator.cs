using System;
using System.Collections.Generic;
using System.Globalization;

namespace CalculatorAPI.Services.Internal
{
    //reverse polish notation (of postfix) algoritme van Rossetta.org
    //Er zitten wel wat haken en ogen aan deze implementatie.
    //Uitbreiding van het aantal soorten calculaties vereist wijzigingen in deze class, en in de shuntingyardhelper (en in de validator)
    //Niet heel erg SOLID, beter zou het zijn om de operators er verder uit te refactoren, evenals de calculaties in de switch
    //van deze class. 
    public class RpnEvaluator : IRpnEvaluator
    {
        public decimal Calculate(string rpnCalculation)
        {
            var rpnTokens = rpnCalculation.Split(' ');
            var stack = new Stack<decimal>();
            foreach (var token in rpnTokens)
            {
                if (decimal.TryParse(token, NumberStyles.Any, CultureInfo.InvariantCulture, out var number))
                    stack.Push(number);
                else
                {
                    switch (token)
                    {
                        case "^":
                            {
                                number = stack.Pop();
                                stack.Push((decimal)Math.Pow((double)stack.Pop(), (double)number));
                                break;
                            }
                        case "*":
                            {
                                stack.Push(stack.Pop() * stack.Pop());
                                break;
                            }
                        case "/":
                            {
                                number = stack.Pop();
                                stack.Push(stack.Pop() / number);
                                break;
                            }
                        case "+":
                            {
                                stack.Push(stack.Pop() + stack.Pop());
                                break;
                            }
                        case "-":
                            {
                                number = stack.Pop();
                                stack.Push(stack.Pop() - number);
                                break;
                            }
                        default:
                            throw new ApplicationException("Er ging iets mis");
                    }
                }
            }

            return stack.Pop();
        }
    }
}
