const domain = require('../../src/utils/domain')

describe('Function getDomainEnv', () => {
  const { getDomainEnv } = domain
  it('should validate local env', () => {
    expect(getDomainEnv('localhost:3000')).toEqual('local')
    expect(getDomainEnv('some else')).toEqual('local')
  })

  it('should validate sit env', () => {
    expect(getDomainEnv('open.sit.ffan.net')).toEqual('sit')
    expect(getDomainEnv('intra.sit.ffan.net')).toEqual('sit')
  })

  it('should validate test env', () => {
    expect(getDomainEnv('open.test.ffan.net')).toEqual('test')
    expect(getDomainEnv('api.test.ffan.net')).toEqual('test')
  })

  it('should validate uat env', () => {
    expect(getDomainEnv('open.uat.ffan.net')).toEqual('uat')
    expect(getDomainEnv('api.uat.ffan.net')).toEqual('uat')
  })

  it('should validate prod env', () => {
    expect(getDomainEnv('open.ffan.net')).toEqual('pub')
    expect(getDomainEnv('api.ffan.net')).toEqual('pub')
  })
})

describe('Function fixDomain', () => {
  const { fixDomain } = domain
  it('should replace local env', () => {
    expect(fixDomain('http://api.sit.ffan.net/abc', 'localhost:3000'))
      .toEqual('http://api.sit.ffan.net/abc')
    expect(fixDomain('http://api.test.ffan.net/abc', 'localhost:3000'))
      .toEqual('http://api.sit.ffan.net/abc')
    expect(fixDomain('http://api.ffan.net/abc', 'localhost:3000'))
      .toEqual('http://api.sit.ffan.net/abc')
  })

  it('should replace sit env', () => {
    expect(fixDomain('http://api.sit.ffan.net/abc', 'open.sit.ffan.net'))
      .toEqual('http://api.sit.ffan.net/abc')
    expect(fixDomain('http://api.test.ffan.net/abc', 'open.sit.ffan.net'))
      .toEqual('http://api.sit.ffan.net/abc')
    expect(fixDomain('http://api.ffan.net/abc', 'open.sit.ffan.net'))
      .toEqual('http://api.sit.ffan.net/abc')
  })

  it('should replace test env', () => {
    expect(fixDomain('http://api.sit.ffan.net/abc', 'open.test.ffan.net'))
      .toEqual('http://api.test.ffan.net/abc')
    expect(fixDomain('http://api.test.ffan.net/abc', 'open.test.ffan.net'))
      .toEqual('http://api.test.ffan.net/abc')
    expect(fixDomain('http://api.ffan.net/abc', 'open.test.ffan.net'))
      .toEqual('http://api.test.ffan.net/abc')
  })

  it('should replace uat env', () => {
    expect(fixDomain('http://api.sit.ffan.net/abc', 'open.uat.ffan.net'))
      .toEqual('http://api.uat.ffan.net/abc')
    expect(fixDomain('http://api.test.ffan.net/abc', 'open.uat.ffan.net'))
      .toEqual('http://api.uat.ffan.net/abc')
    expect(fixDomain('http://api.ffan.net/abc', 'open.uat.ffan.net'))
      .toEqual('http://api.uat.ffan.net/abc')
  })

  it('should replace prod env', () => {
    expect(fixDomain('http://api.sit.ffan.net/abc', 'open.ffan.net'))
      .toEqual('http://api.ffan.net/abc')
    expect(fixDomain('http://api.test.ffan.net/abc', 'open.ffan.net'))
      .toEqual('http://api.ffan.net/abc')
    expect(fixDomain('http://api.ffan.net/abc', 'open.ffan.net'))
      .toEqual('http://api.ffan.net/abc')
  })

  it('should not replace second args', () => {
    expect(fixDomain('http://api.sit.ffan.net/abc?callback=http://api.test.ffan.net',
      'open.ffan.net'))
      .toEqual('http://api.ffan.net/abc?callback=http://api.test.ffan.net')
  })

  it('should throw error when not matched', () => {
    expect(() => {
      fixDomain('http://api.sit.fan.net/abc', 'open.ffan.net')
    }).toThrowError('-- url not matched! --')
  })
})

describe('Function fixComDomain', () => {
  const { fixDomain } = domain
  it('should replace sit env', () => {
    expect(fixDomain('http://api.sit.ffan.com/abc', 'api.sit.ffan.com'))
      .toEqual('http://api.sit.ffan.com/abc')
    expect(fixDomain('http://api.test.ffan.com/abc', 'api.sit.ffan.com'))
      .toEqual('http://api.sit.ffan.com/abc')
    expect(fixDomain('http://api.ffan.com/abc', 'api.sit.ffan.com'))
      .toEqual('http://api.sit.ffan.com/abc')
  })

  it('should replace pub env', () => {
    expect(fixDomain('http://api.sit.ffan.com/abc', 'api.ffan.com'))
      .toEqual('http://api.ffan.com/abc')
    expect(fixDomain('http://api.test.ffan.com/abc', 'api.ffan.com'))
      .toEqual('http://api.ffan.com/abc')
    expect(fixDomain('http://api.ffan.com/abc', 'api.ffan.com'))
      .toEqual('http://api.ffan.com/abc')
  })

})


