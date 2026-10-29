// Photo Frame Commons, slice D: what connects a GitHub account to an ATProto
// identity in this snapshot. Checked by hand on 2026-10-29 against each GitHub
// profile's website field and the ATProto handle's DID document. A matching
// name is never treated as a link.
import type { IdentityNote } from './projection.ts'

export const IDENTITIES: IdentityNote[] = [
  {
    github: 'wesbos',
    atproto: 'wesbos.com (did:plc:etdjdgnly5tz5l5xdd4jq76d)',
    basis: 'domain-claimed-both-ways',
    note: 'The handle wesbos.com is a domain the DID controls; the GitHub profile lists www.wesbos.com as its website. Two claims to one domain, not a cryptographic link.',
  },
  {
    github: 'shindakun',
    atproto: 'shindakun.net (did:plc:7vckjdgokbtlyd4mh7tgn426)',
    basis: 'implied-in-a-post',
    note: 'The GitHub profile lists shindakun.dev, a different domain. In a thread whose first post links PR #3, by GitHub user shindakun, the ATProto account replies “this is only the security focused PR”. That implies authorship; nothing verifies it.',
  },
  {
    github: '(none found)',
    atproto: 'xiangul.bsky.social',
    basis: 'name-only',
    note: 'No GitHub account of that name exists. The post links the repository and is not attached to any problem.',
  },
]
