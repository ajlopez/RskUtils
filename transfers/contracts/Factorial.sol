pragma solidity >=0.5.0 <0.6.0;

contract Factorial {
    uint public result;
    
    function calculate(uint n) public returns (uint) {
        if (n <= 1)
            result = 1;
        else
            result = n * calculate(n - 1);
            
        return result;
    }
}

