# ql-star-wars
simple graphql client for star wars api

**Sample Query:**
```
{
  getPerson(id: 1) {
    name
    height
    mass
    hair_color
    skin_color
    eye_color
    birth_year
    gender
    films {
      title
      episode_id
      opening_crawl
      director
      producer
      release_date
    }
  }
}
```
