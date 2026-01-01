// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ILendingPoolConfigurator Interface
 * @notice Интерфейс для управления конфигурациями пула (Aave V2)
 */
interface ILendingPoolConfigurator {

    // --- События ---

    event ATokenUpgraded(address indexed asset, address indexed proxy, address indexed implementation);
    event BorrowingDisabledOnReserve(address indexed asset);
    event BorrowingEnabledOnReserve(address indexed asset, bool stableRateEnabled);
    event CollateralConfigurationChanged(address indexed asset, uint256 ltv, uint256 liquidationThreshold, uint256 liquidationBonus);
    event ReserveActivated(address indexed asset);
    event ReserveDeactivated(address indexed asset);
    event ReserveDecimalsChanged(address indexed asset, uint256 decimals);
    event ReserveFactorChanged(address indexed asset, uint256 factor);
    event ReserveFrozen(address indexed asset);
    event ReserveInitialized(
        address indexed asset, 
        address indexed aToken, 
        address stableDebtToken, 
        address variableDebtToken, 
        address interestRateStrategyAddress
    );
    event ReserveInterestRateStrategyChanged(address indexed asset, address strategy);
    event ReserveUnfrozen(address indexed asset);
    event StableDebtTokenUpgraded(address indexed asset, address indexed proxy, address indexed implementation);
    event StableRateDisabledOnReserve(address indexed asset);
    event StableRateEnabledOnReserve(address indexed asset);
    event VariableDebtTokenUpgraded(address indexed asset, address indexed proxy, address indexed implementation);

    // --- Методы инициализации ---

    function initialize(address provider) external;

    function initReserve(
        address aTokenImpl,
        address stableDebtTokenImpl,
        address variableDebtTokenImpl,
        uint8 underlyingAssetDecimals,
        address interestRateStrategyAddress
    ) external;

    // --- Управление состоянием резерва ---

    function activateReserve(address asset) external;
    
    function deactivateReserve(address asset) external;
    
    function freezeReserve(address asset) external;
    
    function unfreezeReserve(address asset) external;

    // --- Настройка параметров заимствования ---

    function enableBorrowingOnReserve(address asset, bool stableBorrowRateEnabled) external;
    
    function disableBorrowingOnReserve(address asset) external;
    
    function enableReserveStableRate(address asset) external;
    
    function disableReserveStableRate(address asset) external;

    // --- Настройка риск-параметров ---

    function configureReserveAsCollateral(
        address asset,
        uint256 ltv,
        uint256 liquidationThreshold,
        uint256 liquidationBonus
    ) external;

    function setReserveFactor(address asset, uint256 reserveFactor) external;
    
    function setReserveInterestRateStrategyAddress(address asset, address rateStrategyAddress) external;
    
    function setPoolPause(bool val) external;

    // --- Обновление реализаций (Прокси) ---

    function updateAToken(address asset, address implementation) external;
    
    function updateStableDebtToken(address asset, address implementation) external;
    
    function updateVariableDebtToken(address asset, address implementation) external;
}