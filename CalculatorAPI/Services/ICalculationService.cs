namespace CalculatorAPI.Services
{
    public interface ICalculationService
    {
        public string ConvertToReversePolishNotation(string calculation);

        public decimal Calculate(string rpnCalculation);
    }
}
