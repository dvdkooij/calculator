namespace CalculatorAPI.Dto
{
    public class CalculationResultDto : CalculationDto
    {
        public string PostFix { get; set; }
        public decimal Result { get; set; }
    }
}
