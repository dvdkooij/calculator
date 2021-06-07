using CalculatorAPI.Services.Internal;

namespace CalculatorAPI.Services
{
    public class CalculationService : ICalculationService
    {
        public readonly IShuntingYardHelper _shuntingYardHelper;
        public readonly IRpnEvaluator _rpnEvaluator;

        public CalculationService(IShuntingYardHelper shuntingYardHelper, IRpnEvaluator rpnEvaluator)
        {
            _shuntingYardHelper = shuntingYardHelper;
            _rpnEvaluator = rpnEvaluator;
        }
        
        public string ConvertToReversePolishNotation(string calculation)
        {
            return _shuntingYardHelper.ToReversePolishNotation(calculation);
        }

        public decimal Calculate(string rpnCalculation)
        {
            return _rpnEvaluator.Calculate(rpnCalculation);
        }
    }
}
