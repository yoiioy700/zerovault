// ZeroVault Cairo Smart Contract
// Stores Pedersen hash commitments on Starknet Sepolia
// Deploy with: scarb build && sncast account deploy

#[starknet::contract]
mod ZeroVault {
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess,
        Map, StorageMapReadAccess, StorageMapWriteAccess,
    };

    // ── Events ────────────────────────────────────────────────────────────────

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        CommitmentStored: CommitmentStored,
    }

    #[derive(Drop, starknet::Event)]
    struct CommitmentStored {
        #[key]
        owner: ContractAddress,
        commitment: felt252,
        timestamp: u64,
    }

    // ── Storage ───────────────────────────────────────────────────────────────

    #[storage]
    struct Storage {
        // owner → commitment → exists
        commitments: Map<(ContractAddress, felt252), bool>,
        // owner → count of stored commitments
        commitment_count: Map<ContractAddress, u64>,
    }

    // ── ABI / Interface ───────────────────────────────────────────────────────

    #[starknet::interface]
    trait IZeroVault<TContractState> {
        fn store_commitment(ref self: TContractState, commitment: felt252);
        fn commitment_exists(self: @TContractState, owner: ContractAddress, commitment: felt252) -> bool;
        fn get_commitment_count(self: @TContractState, owner: ContractAddress) -> u64;
    }

    // ── Implementation ────────────────────────────────────────────────────────

    #[abi(embed_v0)]
    impl ZeroVaultImpl of IZeroVault<ContractState> {
        /// Store a Pedersen hash commitment on-chain.
        /// The commitment is bound to the caller's address.
        /// Raw credential data is NEVER passed to this function.
        fn store_commitment(ref self: ContractState, commitment: felt252) {
            let caller = get_caller_address();

            // Idempotent: store only if not already present
            if !self.commitments.read((caller, commitment)) {
                self.commitments.write((caller, commitment), true);
                let count = self.commitment_count.read(caller);
                self.commitment_count.write(caller, count + 1);

                let timestamp = starknet::get_block_timestamp();
                self.emit(CommitmentStored { owner: caller, commitment, timestamp });
            }
        }

        /// Check if an address has stored a given commitment.
        /// Used by the verifier to confirm on-chain anchoring.
        fn commitment_exists(
            self: @ContractState,
            owner: ContractAddress,
            commitment: felt252,
        ) -> bool {
            self.commitments.read((owner, commitment))
        }

        /// Get the total number of commitments stored by an address.
        fn get_commitment_count(self: @ContractState, owner: ContractAddress) -> u64 {
            self.commitment_count.read(owner)
        }
    }
}
