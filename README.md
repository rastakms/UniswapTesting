# Custom Uniswap Deployment

Repository to demonstrate how to deploy Uniswap contracts and use SDK to interact with them.

run `yarn deploy` to run an example.

## Caveats

- `UniswapV2Factory` contract deployment address and `UniswapV2Pair` contract bytecode are hardcoded in `./sdk/src/constants.ts`.
- `yarn deploy` works locally but should be double checkked when using in production (`UniswapV2Pair` bytecode might stay the same but `UniswapV2Factory` should be updated)
- `UniswapV2Pair` bytecode hash is console.logged in the `UniswapV2Factory` contract.

