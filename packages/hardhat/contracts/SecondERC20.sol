pragma solidity =0.5.16;

import "./test/UniswapV2ERC20.sol";

contract SecondERC20 is UniswapV2ERC20 {
    constructor(uint _totalSupply) public {
        _mint(msg.sender, _totalSupply);
    }
}
