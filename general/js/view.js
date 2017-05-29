/**
 * Created by kelvinzhang on 5/29/17.
 */


function isNumber(event)
{
    return event.charCode >= 48 && event.charCode <= 57;
}

function isDecimal(event)
{
    return isNumber(event) || event.charCode === 46;
}

function getValue(id)
{
    return Number(document.getElementById(id).value);
}
