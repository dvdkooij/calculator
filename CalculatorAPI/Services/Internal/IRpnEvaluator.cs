namespace CalculatorAPI.Services.Internal
{
    public interface IRpnEvaluator
    {
        public decimal Calculate(string rpnCalculation);

    }
}
