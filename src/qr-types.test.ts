import { describe, expect, test } from 'bun:test';
import { encode, hasData } from './qr-types';

describe('encode', () => {
  test('adds https to a bare URL and keeps an explicit scheme', () => {
    expect(encode('url', { url: ' example.com ' })).toBe('https://example.com');
    expect(encode('url', { url: 'http://example.com' })).toBe('http://example.com');
  });

  test('escapes WiFi special characters and omits the password on open networks', () => {
    expect(
      encode('wifi', { ssid: 'Office;5G', password: 'a:b,c"d\\e', encryption: 'WPA', hidden: true }),
    ).toBe('WIFI:T:WPA;S:Office\\;5G;P:a\\:b\\,c\\"d\\\\e;H:true;;');
    expect(
      encode('wifi', { ssid: 'Guest', password: 'ignored', encryption: 'nopass', hidden: false }),
    ).toBe('WIFI:T:nopass;S:Guest;;');
  });

  test('URL-encodes the email subject and body', () => {
    expect(encode('email', { to: 'a@b.com', subject: 'Hi there', body: 'a&b' })).toBe(
      'mailto:a@b.com?subject=Hi%20there&body=a%26b',
    );
    expect(encode('email', { to: 'a@b.com', subject: '', body: '' })).toBe('mailto:a@b.com');
  });

  test('builds SMS, phone and X profile payloads', () => {
    expect(encode('sms', { phone: '+218 91', message: ' hello ' })).toBe('SMSTO:+218 91:hello');
    expect(encode('sms', { phone: '+21891', message: '' })).toBe('SMSTO:+21891');
    expect(encode('phone', { phone: ' +21891 ' })).toBe('tel:+21891');
    expect(encode('x-profile', { username: '@jack' })).toBe('https://x.com/jack');
  });

  test('formats timed and all-day calendar events', () => {
    const base = { title: 'Launch', location: '', description: '', endDate: '', endTime: '' };
    expect(
      encode('event', { ...base, startDate: '2026-10-11', startTime: '09:30', allDay: false }),
    ).toBe(
      ['BEGIN:VEVENT', 'SUMMARY:Launch', 'DTSTART:20261011T093000', 'DTEND:20261011T000000', 'END:VEVENT'].join('\r\n'),
    );
    expect(encode('event', { ...base, startDate: '2026-10-11', startTime: '', allDay: true })).toBe(
      ['BEGIN:VEVENT', 'SUMMARY:Launch', 'DTSTART;VALUE=DATE:20261011', 'DTEND;VALUE=DATE:20261011', 'END:VEVENT'].join('\r\n'),
    );
  });

  test('writes MeCard names last-first with escaping', () => {
    expect(
      encode('mecard', {
        firstName: 'Jo',
        lastName: 'Doe',
        phone: '123',
        email: '',
        org: 'A;B',
        url: '',
        address: '',
        note: '',
      }),
    ).toBe('MECARD:N:Doe,Jo;TEL:123;ORG:A\\;B;;');
  });
});

describe('hasData', () => {
  test('requires the field each type cannot encode without', () => {
    expect(hasData('url', { url: '   ' })).toBe(false);
    expect(hasData('wifi', { ssid: 'Net', password: '', encryption: 'nopass', hidden: false })).toBe(true);
    expect(hasData('event', { title: 'Launch', startDate: '' })).toBe(false);
  });
});
