/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/voting_dapp.json`.
 */
export type VotingDapp = {
    "address": "GLqUArUHjD9NrEkYwoPGKNtMcaeBuqBtxbf4SiHuVfVy",
    "metadata": {
        "name": "votingDapp",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "initializeCandidate",
            "discriminator": [
                210,
                107,
                118,
                204,
                255,
                97,
                112,
                26
            ],
            "accounts": [
                {
                    "name": "signer",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "pollAccount"
                },
                {
                    "name": "candidateAccount",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "arg",
                                "path": "pollId"
                            },
                            {
                                "kind": "arg",
                                "path": "candidate"
                            }
                        ]
                    }
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "pollId",
                    "type": "u64"
                },
                {
                    "name": "candidate",
                    "type": "string"
                }
            ]
        },
        {
            "name": "initializePoll",
            "discriminator": [
                193,
                22,
                99,
                197,
                18,
                33,
                115,
                117
            ],
            "accounts": [
                {
                    "name": "signer",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "pollAccount",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    112,
                                    111,
                                    108,
                                    108
                                ]
                            },
                            {
                                "kind": "arg",
                                "path": "pollId"
                            }
                        ]
                    }
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "pollId",
                    "type": "u64"
                },
                {
                    "name": "startTime",
                    "type": "u64"
                },
                {
                    "name": "endTime",
                    "type": "u64"
                },
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "description",
                    "type": "string"
                }
            ]
        },
        {
            "name": "vote",
            "discriminator": [
                227,
                110,
                155,
                23,
                136,
                126,
                172,
                25
            ],
            "accounts": [
                {
                    "name": "signer",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "pollAccount",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    112,
                                    111,
                                    108,
                                    108
                                ]
                            },
                            {
                                "kind": "arg",
                                "path": "pollId"
                            }
                        ]
                    }
                },
                {
                    "name": "candidateAccount",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "arg",
                                "path": "pollId"
                            },
                            {
                                "kind": "arg",
                                "path": "candidate"
                            }
                        ]
                    }
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "pollId",
                    "type": "u64"
                },
                {
                    "name": "candidate",
                    "type": "string"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "candidate",
            "discriminator": [
                86,
                69,
                250,
                96,
                193,
                10,
                222,
                123
            ]
        },
        {
            "name": "poll",
            "discriminator": [
                110,
                234,
                167,
                188,
                231,
                136,
                153,
                111
            ]
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "votingNotStarted",
            "msg": "Voting has not started yet"
        },
        {
            "code": 6001,
            "name": "votingEnded",
            "msg": "Voting has ended"
        }
    ],
    "types": [
        {
            "name": "candidate",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "candidateName",
                        "type": "string"
                    },
                    {
                        "name": "candidateVotes",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "poll",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "pollName",
                        "type": "string"
                    },
                    {
                        "name": "pollDescription",
                        "type": "string"
                    },
                    {
                        "name": "pollVotingStart",
                        "type": "u64"
                    },
                    {
                        "name": "pollVotingEnd",
                        "type": "u64"
                    },
                    {
                        "name": "pollOptionIndex",
                        "type": "u64"
                    }
                ]
            }
        }
    ]
};
  