import styles from './styles.module.scss';


const Player = () => {

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"></img>
                <strong>Tocando Agora</strong>
            </header>
            <div className={styles.emptyPlayer}><p>Selecione um podcast para ouvir</p>
            </div>
            <p>Teste2</p>
        </div>
    );
}

export default Player;