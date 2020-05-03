pragma solidity >=0.5.0 <0.7.0;
import "@gnosis.pm/safe-contracts/contracts/base/Module.sol";
import "@gnosis.pm/safe-contracts/contracts/base/ModuleManager.sol";
import "@gnosis.pm/safe-contracts/contracts/base/OwnerManager.sol";
import "@gnosis.pm/safe-contracts/contracts/common/Enum.sol";


/// @title 3Box Recovery Module - Allows to replace an owner without Safe confirmations with 3Box integration
/// @author Manank Patni - <manank321@gmail.com>
contract ThreeBoxRecoveryModule is Module {
    string public constant NAME = "3Box Recovery Module";
    string public constant VERSION = "0.1.0";

    address public backupAdminAddress;
    bool isRecoverable;

    modifier onlyBackup() {
        require(isRecoverable == true,'Already Recovered Once');
        _;
    }

    function setup(address _backupAddress)
    public
    {
        setManager();
        backupAdminAddress = _backupAddress;
        isRecoverable = true;
    }

    function recoverAccess(address prevOwner, address oldOwner, address newOwner)
        public
        onlyBackup
    {
        require(msg.sender == backupAdminAddress, 'Not the correct backup Account');
        //bytes memory data = abi.encodeWithSignature("swapOwner(address,address,address)", prevOwner, oldOwner, newOwner);
        bytes memory addOwnerData = abi.encodeWithSignature("addOwnerWithThreshold(address,uint256)", newOwner, 1);
        require(manager.execTransactionFromModule(address(manager), 0, addOwnerData, Enum.Operation.Call), "Could not execute recovery");
    }
}