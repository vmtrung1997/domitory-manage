function OpitmizeNumber(number) {


    var result = number;
    if (number) {
        var numberAccount = number.toString();
        //tách đuôi có dạng 12345.5
        numberAccount.replace(".", "");
        var subnumber = null;
        var index = numberAccount.indexOf('.');
        if (index !== -1) {
            subnumber = numberAccount.substr(index, numberAccount.length - 1);
            numberAccount = numberAccount.substr(0, index)
        
        }
        var array = [];
        var i = 0;
        while (numberAccount.length >= 3) {
            array[i] = numberAccount.substr(numberAccount.length - 3, 3);
            numberAccount = numberAccount.substr(0, numberAccount.length - 3);
            i++;
        }
        if (numberAccount.length > 0)
            array[i] = numberAccount.substr(0, numberAccount.length);


        result = array[array.length - 1] + '.';
        for (var ii = array.length - 2; ii >= 0; ii--) {
            result = result + array[ii] + '.'
        }
        result = result.substr(0, result.length - 1);
        if (subnumber)
            result = result + subnumber;


    }
    return result;
}

export default { OpitmizeNumber }