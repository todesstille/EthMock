// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.8.0;

interface IAToken {
    /**
     * @dev Евенты согласно ABI
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event BalanceTransfer(address indexed from, address indexed to, uint256 value, uint256 index);
    event Burn(address indexed from, address indexed target, uint256 value, uint256 index);
    event Initialized(
        address indexed underlyingAsset,
        address indexed pool,
        address treasury,
        address incentivesController,
        uint8 aTokenDecimals,
        string aTokenName,
        string aTokenSymbol,
        bytes params
    );
    event Mint(address indexed from, uint256 value, uint256 index);
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev View функции
     */
    function ATOKEN_REVISION() external view returns (uint256);
    function DOMAIN_SEPARATOR() external view returns (bytes32);
    function EIP712_REVISION() external view returns (bytes memory);
    function PERMIT_TYPEHASH() external view returns (bytes32);
    function POOL() external view returns (address);
    function RESERVE_TREASURY_ADDRESS() external view returns (address);
    function UINT_MAX_VALUE() external view returns (uint256);
    function UNDERLYING_ASSET_ADDRESS() external view returns (address);
    function _nonces(address user) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function balanceOf(address user) external view returns (uint256);
    function decimals() external view returns (uint8);
    function getIncentivesController() external view returns (address);
    function getScaledUserBalanceAndSupply(address user) external view returns (uint256, uint256);
    function name() external view returns (string memory);
    function scaledBalanceOf(address user) external view returns (uint256);
    function scaledTotalSupply() external view returns (uint256);
    function symbol() external view returns (string memory);
    function totalSupply() external view returns (uint256);

    /**
     * @dev Мутирующие функции
     */
    function approve(address spender, uint256 amount) external returns (bool);
    function burn(
        address user,
        address receiverOfUnderlying,
        uint256 amount,
        uint256 index
    ) external;
    function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool);
    function increaseAllowance(address spender, uint256 addedValue) external returns (bool);
    function initialize(
        uint8 underlyingAssetDecimals,
        string calldata tokenName,
        string calldata tokenSymbol
    ) external;
    function mint(
        address user,
        uint256 amount,
        uint256 index
    ) external returns (bool);
    function mintToTreasury(uint256 amount, uint256 index) external;
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
    function transferOnLiquidation(
        address from,
        address to,
        uint256 value
    ) external;
    function transferUnderlyingTo(address target, uint256 amount) external returns (uint256);
}