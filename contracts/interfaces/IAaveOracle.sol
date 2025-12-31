// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.8.20;


interface IPriceOracleGetter {
  function getAssetPrice(address asset) external view returns (uint256);
}

interface IAaveOracle is IPriceOracleGetter {
  event WethSet(address indexed weth);
  event AssetSourceUpdated(address indexed asset, address indexed source);
  event FallbackOracleUpdated(address indexed fallbackOracle);

  function owner() external view returns (address);
  function WETH() external view returns (address);
  function setAssetSources(address[] calldata assets, address[] calldata sources) external;
  function setFallbackOracle(address fallbackOracle) external;
  function getAssetPrice(address asset) external view returns (uint256);
  function getAssetsPrices(address[] calldata assets) external view returns (uint256[] memory);
  function getSourceOfAsset(address asset) external view returns (address);
  function getFallbackOracle() external view returns (address);
}