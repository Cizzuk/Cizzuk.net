---
layout: "default"
lang: "en"
permalink: "/commit-signature/"
title: "Commit Signature"
description: "GPG or SSH keys used for signing Git commits"
update: 2026-11-23
---

# {{ title }}

Last update: {{ update | date }}

I sign the commits to my public Git repositories. This page provides the keys used for these signatures.

## Available

| Type | Key ID | Expires | Public Key |
|-|-|-|-|
| SSH | SHA256:eQaEgbw27wmJhNruwqJyjsb7/lRfhuQmwSmX/LP8/IU | None | |

In addition to the keys above, commits made via GitHub Apps or on GitHub.com are signed by GitHub. For more details, please refer to the [GitHub documentation](https://docs.github.com/ja/authentication/managing-commit-signature-verification/about-commit-signature-verification#signature-verification-for-rebase-and-merge) or check the current [GitHub GPG public key](https://github.com/web-flow.gpg).

## Revoked

| Type | Key ID | Expires | Public Key |
|-|-|-|-|
| GPG | A433F36A3A071462 | {{ '2026-11-23' | date }} | [Download](/assets/openpgp/revoked/A844234935EDD7C58311C73DA433F36A3A071462.asc) |
| GPG | E7930483B159E7C0 | {{ '2026-11-23' | date }} | [Download](/assets/openpgp/revoked/A844234935EDD7C58311C73DA433F36A3A071462.asc) |
| GPG | 849A021923D522D8 | {{ '2025-03-17' | date }} | |
| GPG | B8A25D94B557E718 | {{ '2025-03-17' | date }} | |
| GPG | 6EA23EB68B3002AD | {{ '2025-01-27' | date }} | |
| GPG | 9C2849F008627902 | {{ '2025-01-27' | date }} | |
| GPG | D4672B9F96A0C9F6 | {{ '2024-06-02' | date }} | |
| GPG | 34E9B3CC0319D924 | {{ '2024-06-02' | date }} | |
