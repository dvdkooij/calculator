using System;
using System.Collections.Generic;
using System.Linq;

namespace CalculatorAPI.Services.Internal
{
    //shuntinyard algoritme van Rosetta.org
    public class ShuntingYardHelper : IShuntingYardHelper
    {
        readonly Dictionary<string, (string symbol, int precedence, bool rightAssociative)> Operators =
            new (string symbol, int precedence, bool rightAssociative)[]
            {
                ("^", 4, true),
                ("*", 3, false),
                ("/", 3, false),
                ("+", 2, false),
                ("-", 2, false)
            }.ToDictionary(op => op.symbol);

        public string ToReversePolishNotation(string infix)
        {
            var tokens = infix.Split(' ');
            var stack = new Stack<string>();
            var output = new List<string>();
            foreach (var token in tokens)
            {
                if (double.TryParse(token, out _))
                    output.Add(token);
                else if (Operators.TryGetValue(token, out var op1))
                {
                    while (stack.Count > 0 && Operators.TryGetValue(stack.Peek(), out var op2))
                    {
                        var c = op1.precedence.CompareTo(op2.precedence);
                        if (c < 0 || !op1.rightAssociative && c <= 0)
                            output.Add(stack.Pop());
                        else
                            break;
                    }
                    stack.Push(token);
                }
                else if (token == "(")
                    stack.Push(token);
                else if (token == ")")
                {
                    var top = "";
                    while (stack.Count > 0 && (top = stack.Pop()) != "(")
                    {
                        output.Add(top);
                    }
                    if (top != "(") throw new ArgumentException("No matching left parenthesis.");
                }
            }
            while (stack.Count > 0)
            {
                var top = stack.Pop();
                if (!Operators.ContainsKey(top)) throw new ArgumentException("No matching right parenthesis.");
                output.Add(top);
            }

            output = AdjustOperandWithOneOperator(output);
            return string.Join(" ", output);
        }

        // in principe is de berekening 4 *, 4 - als postfix niet geldig
        // maar een rekenmachine snapt dat meestal wel,
        // onder de voorwaarde dat het eerste item een operand is en de tweede een operator wordt de operand nogmaals toegevoegd
        List<string> AdjustOperandWithOneOperator(List<string> tokens)
        {
            if (tokens.Count < 2)
                throw new ArgumentException("Not a valid number of operators and operands");

            if (tokens.Count > 2)
                return tokens;
            
            var operatorsInTokens = Operators.Where(d => tokens.Contains(d.Key)).ToList();

            if (operatorsInTokens.Count() == 1 &&
                tokens[1] == operatorsInTokens.First().Key) { 
                var operand = tokens[0];
                tokens.Insert(0, operand);
                return tokens;
            }

            throw new ArgumentException("Not a valid number of operators and operands");
        }
    }
}
