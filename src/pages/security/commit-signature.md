---
layout: "default"
lang: "en"
permalink: "/security/commit-signature/"
title: "Commit Signature"
description: "GPG or SSH keys used for signing Git commits"
update: 2026-11-23
---

# {{ title }}

Last update: {{ update | date }}

I sign the commits to my public Git repositories. This page provides the keys used for these signatures.

## Available

| Type | Key ID | Since | Expires | Public Key |
|-|-|-|-|-|
| SSH | SHA256:eQaEgbw27wmJhNruwqJyjsb7/lRfhuQmwSmX/LP8/IU | {{ '2026-11-23' | date }} | None | [Download](/assets/keys/ssh/BF357A44100ACAA3C60D3255D77D050596B12E1D.pub) |

In addition to the keys above, commits made via GitHub Apps or on GitHub.com are signed by GitHub. For more details, please refer to the [GitHub documentation](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification#signature-verification-for-rebase-and-merge) or check the current [GitHub GPG public key](https://github.com/web-flow.gpg).

## Revoked

| Type | Key ID | Since | Revoked on | Public Key |
|-|-|-|-|-|
| GPG | A433F36A3A071462 | {{ '2025-03-21' | date }} | {{ '2026-11-23' | date }} | [Download](/assets/keys/openpgp/revoked/A844234935EDD7C58311C73DA433F36A3A071462.asc) |
| GPG | 849A021923D522D8 | {{ '2025-01-28' | date }} | {{ '2025-03-17' | date }} | [Download](/assets/keys/openpgp/revoked/C12200003A65BE2BC441BEDE849A021923D522D8.asc) |
| GPG | 6EA23EB68B3002AD | {{ '2024-06-04' | date }} | {{ '2025-01-27' | date }} | |
| GPG | D4672B9F96A0C9F6 | {{ '2023-12-30' | date }} | {{ '2024-06-02' | date }} | |
