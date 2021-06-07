namespace CalculatorAPI.Services.Internal
{
    public interface IShuntingYardHelper
    {
        public string ToReversePolishNotation(string calculation);
    }
}
