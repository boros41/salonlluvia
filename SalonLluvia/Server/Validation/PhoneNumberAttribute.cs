using PhoneNumbers;
using System.ComponentModel.DataAnnotations;

namespace Server.Validation;

public class PhoneNumberAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        PhoneNumberUtil phoneNumberUtil = PhoneNumberUtil.GetInstance();

        // Automatically pass if value is null. RequiredAttribute should be used to assert a value is not null.
        // We expect a cast exception if a non-string was passed in.
        if (value is null)
        {
            return ValidationResult.Success;
        }

        try
        {
            string rawPhoneNumber = (string)value;
            PhoneNumber possiblePhoneNumber = phoneNumberUtil.Parse(rawPhoneNumber, "US");

            if (!phoneNumberUtil.IsValidNumber(possiblePhoneNumber))
            {
                return new ValidationResult(GetMessage());
            }
        }
        catch (NumberParseException e)
        {
            return new ValidationResult(GetMessage());
        }
        catch (InvalidCastException e)
        {
            return new ValidationResult(GetMessage());
        }

        return ValidationResult.Success;
    }

    private string GetMessage()
    {
        return base.ErrorMessage ?? $"Please enter a valid phone number";
    }
}