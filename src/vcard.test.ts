import { describe, expect, test } from 'bun:test';
import { buildVCard, defaultVCard, hasMinimumData, type VCardData } from './vcard';

function card(overrides: Partial<VCardData>): VCardData {
  return { ...defaultVCard, phones: [], emails: [], ...overrides };
}

function lines(vcard: string): string[] {
  return vcard.split('\r\n');
}

describe('buildVCard', () => {
  test('wraps a 3.0 card in CRLF lines with N and FN', () => {
    const out = lines(buildVCard(card({ firstName: 'Jane', lastName: 'Doe', prefix: 'Dr.' })));
    expect(out[0]).toBe('BEGIN:VCARD');
    expect(out[1]).toBe('VERSION:3.0');
    expect(out).toContain('N:Doe;Jane;;Dr.;');
    expect(out).toContain('FN:Dr. Jane Doe');
    expect(out.at(-1)).toBe('END:VCARD');
    expect(out.at(-2)).toMatch(/^REV:\d{8}T\d{6}Z$/);
  });

  test('escapes semicolons, commas, backslashes and newlines', () => {
    const out = lines(buildVCard(card({ org: 'Acme, Inc; R\\D', note: 'one\ntwo' })));
    expect(out).toContain('ORG:Acme\\, Inc\\; R\\\\D');
    expect(out).toContain('NOTE:one\\ntwo');
  });

  test('keeps each address component in its RFC 2426 slot', () => {
    const out = lines(
      buildVCard(
        card({
          firstName: 'Jane',
          addresses: [
            {
              type: 'WORK',
              poBox: 'PO 1',
              street2: 'Suite 4',
              street: '123 Main St',
              city: 'Springfield',
              state: 'IL',
              zip: '62701',
              country: 'US',
              geo: '39.78,-89.65',
            },
          ],
        }),
      ),
    );
    expect(out).toContain('ADR;TYPE=WORK:PO 1;Suite 4;123 Main St;Springfield;IL;62701;US');
    expect(out).toContain('GEO:39.78,-89.65');
  });

  test('skips blank phones, emails and empty addresses', () => {
    const out = buildVCard(
      card({
        firstName: 'Jane',
        phones: [
          { type: 'CELL', value: ' +21891 ' },
          { type: 'WORK', value: '  ' },
        ],
        emails: [{ type: 'WORK', value: '' }],
        addresses: [
          { type: 'HOME', poBox: '', street2: '', street: ' ', city: '', state: '', zip: '', country: '' },
        ],
      }),
    );
    expect(lines(out)).toContain('TEL;TYPE=CELL:+21891');
    expect(out).not.toContain('TEL;TYPE=WORK');
    expect(out).not.toContain('EMAIL');
    expect(out).not.toContain('ADR');
  });
});

describe('hasMinimumData', () => {
  test('needs a first name, last name or organization', () => {
    expect(hasMinimumData(card({}))).toBe(false);
    expect(hasMinimumData(card({ org: 'Acme' }))).toBe(true);
  });
});
