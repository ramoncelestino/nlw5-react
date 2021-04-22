// SPA (React)
// SSR Server Side Rendering
// SSG Static Site Generation
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import { DEFAULT_MAX_VERSION } from 'node:tls';
import { useEffect, useState } from "react"

import styles from './home.module.scss'
import Image from 'next/image'

import { GetStaticProps } from 'next';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

type Episode = {
  id: string;
  title:string;
  thumbnail:string;
  description: string;
  members: string;
  duration: number;
  durationAsString:string;
  url: string;
  publishedAt: string;

}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
        {latestEpisodes.map(episode => {
          return (
              <li key={episode.id}>
                <Image width={192} height={192} src={episode.thumbnail} alt="Episode" objectFit="cover"></Image>

                <div className={styles.episodeDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
          );
        })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
            return(
            <tr key={episode.id}>
              <td style={{ width: 72}}>
                <Image
                  width={120}
                  height={120}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"></Image>
              </td>
              <td>
                <a href="">{episode.title}</a>
              </td>
              <td>{episode.members}</td>
              <td style={{ width: 100}}>{episode.publishedAt}</td>
              <td>{episode.durationAsString}</td>
              <td><button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button></td>
            </tr>
            );
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}


//React
  /******* SPA Example *******/
  
  /*useEffect(() => {
    fetch('http://localhost:3333/episodes').then(response => response.json()).then(data => console.log(data))
  }, []) */

  /*********/

  /****** Axios ******/
  /*const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('http://localhost:3333/episodes')
      setData(data)
    };

    fetchData();
  } , []);*/

  /*************/

/**** SSR Example ******/
/*export async function getServerSideProps(){
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  console.log(data);
  return {
    props: {
      episodes: data,
    }
  }
}*/
/**********************/

/**** SSG Example******/
export const getStaticProps: GetStaticProps = async () =>{
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,


    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.lenght);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}