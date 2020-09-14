pragma solidity >=0.5.0 <0.6.0;

import "./RecursiveInterface.sol";
import "./RecursiveChild.sol";

contract RecursiveParent is RecursiveInterface {
    uint public counter;
    RecursiveChild public recursive;
    mapping(uint => bool) public map;
    
    constructor() public {
        recursive = new RecursiveChild(this);
    }
    
    function increment(uint level) public {
        if (level == 0)
            return;
            
        counter++;
        
        map[counter] = true;
        
        recursive.increment(level - 1);
    }
}

