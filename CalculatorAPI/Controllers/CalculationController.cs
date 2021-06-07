using Microsoft.AspNetCore.Mvc;
using System;
using CalculatorAPI.Dto;
using CalculatorAPI.Services;
using Microsoft.AspNetCore.Http;

namespace CalculatorAPI.Controllers
{
    [ApiController]
    [Route("api/calculation")]
    public class CalculationController : ControllerBase
    {
        private readonly ICalculationService _calculationService;

        //dependencies overal zoveel mogelijk beperken en gebruik maken van DI
        //waardoor je gemakkelijk unit testing kan toevoegen op API, Service en Validators
        public CalculationController(ICalculationService calculationService)
        {
            _calculationService = calculationService;
        }
      
        //calculator bevat maar 1 api call.  Deze zorgt ervoor dat een infix string omgezet wordt naar postfix 
        //en dat het resultaat vervolgens terugkomt in een datatransfer object.  Het result object bevat het
        //resultaat van de calculatie en de infix en postfix calculatie strings.
        //het is natuurlijk wat gekunsteld op deze manier
        //De post maakt niet echt een recource, je kunt argumenteren dat het api niet Idempotent is.
        //Maar goed ik hoop dat het laat zien dat ik met Api's kan omgaan. 
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type=typeof(CalculationDto))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult Calculation([FromBody] CalculationDto calculationDto)
        {
            try
            {
                var rpnCalculation = _calculationService.ConvertToReversePolishNotation(calculationDto.Infix);
                var calculationResult = _calculationService.Calculate(rpnCalculation);

                var result = new CalculationResultDto
                {
                    Infix = calculationDto.Infix,
                    PostFix = rpnCalculation,
                    Result = calculationResult
                };
                return Ok(result);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
