using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Raja_Portfolio.Server.Models;

namespace Raja_Portfolio.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PortfolioController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        private readonly string _portfolioScript = "https://script.google.com/macros/s/AKfycbzoI35A8C-T9QIbvb7OiqQ7DbWtZjGp_c_YnaIRrR8vWBmt_wJmgqayFRnUid-T7MIT/exec";

        public PortfolioController(IHttpClientFactory factory)
        {
            _httpClient = factory.CreateClient();
        }

        [HttpPost("contact")]
        public async Task<IActionResult> SaveContact([FromBody] Contact model)
        {
            var payload = new
            {
                name = model.Name,
                email = model.Email,
                message = model.Message
            };

            var response = await _httpClient.PostAsJsonAsync(_portfolioScript, payload);

            if (!response.IsSuccessStatusCode)
            {
                return BadRequest("Failed to send data to Google Sheets");
            }

            return Ok(new { message = "Saved successfully" });
        }
        [HttpPost("{type}")]
        public async Task<IActionResult> LogActivity(string type)
        {

            var payload = new { type = type };

            // 2. Send the POST request to your Google Apps Script
            // Use the URL you got from the "New Deployment" step in Google Apps Script
            var response = await _httpClient.PostAsJsonAsync(_portfolioScript, payload);

            if (response.IsSuccessStatusCode)
            {
                return Ok(new { message = $"Successfully logged {type}" });
            }

            return StatusCode((int)response.StatusCode, "Failed to log activity to Google Sheets");
        }
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var result = await _httpClient.GetStringAsync(_portfolioScript);
            return Content(result, "application/json");
        }
    }

}
