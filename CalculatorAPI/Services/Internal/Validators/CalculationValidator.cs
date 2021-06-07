using System;
using CalculatorAPI.Dto;
using FluentValidation;

namespace CalculatorAPI.Services.Internal.Validators
{
    public class CalculationValidator : AbstractValidator<CalculationDto>
    {
        private readonly ICalculationService _calculationService;

        public CalculationValidator(ICalculationService calculationService)
        {
            _calculationService = calculationService;

            //een lege calculatie aanbieden mag niet.
            RuleFor(c => c.Infix).NotEmpty().WithMessage("no calculation in the request");

            //alleen digits en ondersteunde operators 
            RuleFor(c => c.Infix).Matches(@"^[0-9.\-+/\^\*\s()]*$")
                .WithMessage("calculation contains characters that are not allowed");

            //de shuntingyardhelper checkt deels de correctheid van het infix format, deze misbruiken voor validatie
            //shuntingyard ontdekt niet dat een infix eindigt met een operator, quickfix in deze validatie
            RuleFor(c => c.Infix).Custom((s, context) =>
            {
                try
                {
                    var infix = s.Trim();
                    if (infix.EndsWith('*') || infix.EndsWith('+') || infix.EndsWith('-') || infix.EndsWith('/') || infix.EndsWith('^'))
                        context.AddFailure("calculation cannot end with an operator");

                    _calculationService.ConvertToReversePolishNotation(infix);
                }
                catch (Exception e)
                {
                    context.AddFailure(e.Message);
                }
            });
        }
    }
}
