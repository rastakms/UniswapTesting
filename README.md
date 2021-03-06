<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://github.com/rastakms/shambit-contracts/raw/master/logo.png" width="400"></a></p>
<p align="center">
<a href=""><img src="https://img.shields.io/github/downloads/rastakms/shambit-contracts/total" alt="License"></a><a href=""><img src="https://img.shields.io/github/issues-pr/rastakms/shambit-contracts" alt="License"></a>
<a href=""><img src="https://img.shields.io/github/issues-closed/rastakms/shambit-contracts" alt="License"></a>
<a href=""><img src="https://img.shields.io/github/license/rastakms/shambit-contracts" alt="License"></a>
<a href=""><img src="https://img.shields.io/github/last-commit/rastakms/shambit-contracts" alt="License"></a>

Decentralized  digital  ecosystem made by athletes.

</p>


---

## Quickstart

```bash
git clone

cd
```

```bash

yarn install

```

```bash

yarn start

```

> in a second terminal window:

```bash
cd
yarn chain

```

> in a third terminal window:

```bash
cd
yarn deploy

```
## Useful scripts

Approve some SBT token in order to using in create event phase:
```bash
yarn approveSBT
```

Easy  and fast way to create event with default value :
```bash
yarn addPublicEvent
```



<p align="center">
Powered by  <a href="https://github.com/austintgriffith/scaffold-eth" target="_blank"> scaffold-eth</a> | Feel free to make a  pull  request
</p# Custom Uniswap Deployment

Repository to demonstrate how to deploy Uniswap contracts and use SDK to interact with them.

run `yarn deploy` to run an example.

## Caveats

- `UniswapV2Factory` contract deployment address and `UniswapV2Pair` contract bytecode are hardcoded in `./sdk/src/constants.ts`.
- `yarn deploy` works locally but should be double checkked when using in production (`UniswapV2Pair` bytecode might stay the same but `UniswapV2Factory` should be updated)
- `UniswapV2Pair` bytecode hash is console.logged in the `UniswapV2Factory` contract.

>