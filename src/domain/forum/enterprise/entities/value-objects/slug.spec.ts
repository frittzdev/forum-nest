import { Slug } from './slug'

test('it should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('Exemplo question title')

  expect(slug.value).toEqual('exemplo-question-title')
})