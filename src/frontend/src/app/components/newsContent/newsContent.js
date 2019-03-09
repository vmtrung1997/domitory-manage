import React from 'react'
import './newsContent.css'

const fadeImages = [
    '/images/01_ataulfohouse_apaloosa.jpg',
    '/images/26_ataulfohouse_apaloosa.jpg',
    '/images/26_ataulfohouse_apaloosa.jpg',
];

class NewsContent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className='news-content-detail'>
                    <div className='news-detail'>
                        <div className='news-detail-sub'>
                            <div className='tilte'>
                                <span>Diamlorem interdum penatibus natoque repellendus ea
                            commodo per quisquam aenean.</span>
                            </div>
                            <div className='content-detail-time'>
                                <span>18 : 10 | Thứ 7, 20-1-2018</span></div>
                            <div className='content-detail'>
                                <p>Eleifend pretium consectetuer eos modi dignissim? Sem provident, architecto error, facilisi viverra, urna aliquam, viverra! Excepteur sit aliqua ea, doloribus! Feugiat, turpis aut tortor exercitation platea, delectus convallis placeat laoreet, soluta autem alias, nisl perspiciatis duis, blanditiis rem pharetra, exercitationem commodi tempor? Alias pariatur nostrum! Ligula nobis venenatis nostrum vitae. Distinctio aperiam maecenas vulputate corporis nascetur mauris. Iaculis! Vehicula, maxime.

                                    Lacus commodi cumque, dicta cumque. Netus natus pulvinar proin animi porttitor elementum nibh pretium! Nibh provident. Primis ab, dapibus platea congue nihil fermentum facilisis phasellus a laoreet? Adipiscing placeat quibusdam! Mi esse curae perferendis adipisci consequat magnam aspernatur, neque varius montes molestiae provident. Nobis tristique inventore congue repellat anim, aliquet qui in eu, nonummy egestas tristique, consequuntur, quos, natoque fermentum.

                                    Urna praesent eveniet per dictumst, ante dolorem! Dolor vehicula exercitationem imperdiet mauris, consectetur ratione, animi placeat. Nesciunt ullam porro! Viverra mollit ratione veritatis nobis feugiat facilisi distinctio dolore magni porta tincidunt, lorem? Officia rerum delectus, itaque ultricies libero cum laoreet. Sagittis venenatis. Voluptatum in, purus! Wisi temporibus quo? Molestiae perferendis iure amet? Quaerat, massa adipisci, sed ullamco nulla ducimus exercitation.

                                    Lobortis aliqua aute nihil, erat sequi at debitis, dictum earum, voluptas sagittis! Rerum ducimus iaculis? Congue illo perferendis! Dolores ac donec quam pellentesque consequat? Error soluta? Quisque fugiat excepturi laoreet? Accusamus montes habitant quis ligula cillum, velit nonummy perferendis tempora, architecto posuere? Dolore vehicula, proin non velit nulla metus, a inceptos quae accusantium, vulputate tellus ullam posuere fames ex reprehenderit.

                                    Suspendisse erat quidem error error natoque gravida iste, dictum facilis eleifend arcu inceptos doloribus, excepturi! Eaque lobortis adipisci, in cupiditate montes, dignissim atque unde qui recusandae accusamus adipisicing cubilia aliquet. Omnis temporibus harum hymenaeos fuga itaque. Vulputate tincidunt enim nam semper malesuada molestie urna? Incidunt quos vitae. Duis magnis semper leo pellentesque voluptates, ut provident suspendisse justo porta, esse sit.

                                    Blanditiis aperiam quod aliqua! Dignissim ante? Natus doloribus mollis, quisquam! Montes eos, commodo natus, ultrices dolorem, nulla lectus primis rerum, placeat netus facilisis? Elit? Purus nostrum voluptates? Diamlorem error nascetur suscipit accumsan, euismod vivamus assumenda maxime, tellus, interdum saepe nesciunt! Porro nostra, turpis nostra senectus molestie rutrum nascetur? At sodales explicabo? Pretium anim nostrum potenti natoque? Deleniti nam cupiditate dis.

                                    Dui semper diam impedit lacus vero inventore congue necessitatibus eleifend, sem sociis asperiores rem veritatis fringilla, autem etiam, facilis sequi similique! Eu vitae alias? Iure eius, aenean fuga aenean luctus nostra ab? Laborum amet distinctio pariatur! Potenti, accumsan faucibus fugiat tellus adipisci! Illo cumque dapibus? Adipisci magnam quisque ullamcorper sequi torquent euismod aliquid accumsan sunt cillum! Dolores facilisis quas nascetur.

                                    Fugit fugit, per montes eligendi donec a egestas ipsa porro urna! Platea nulla consectetuer at occaecat, accusamus semper proin eveniet odit, montes gravida ante rerum vestibulum veniam suspendisse porta eos soluta, natus dapibus turpis beatae natus auctor, occaecat eveniet lobortis voluptatem magni, vitae vivamus, pretium volutpat eos curabitur risus aliquip aenean, mollitia vel quos, interdum eget? Delectus condimentum, culpa netus.

                                Donec inventore malesuada, iusto phasellus unde, anim do porro varius nec tristique, architecto explicabo? Quae nostrum impedit sociis commodo saepe unde consequat eaque? Mus ratione penatibus illo? Sollicitudin. Accumsan cupidatat, nostra nisi ultrices consequatur ipsa. Quasi quasi suspendisse praesent quibusdam? Atque asperiores velit explicabo, diam sollicitudin odit! Eos. Suspendisse taciti vehicula aut auctor, cursus viverra dolores? Hendrerit itaque? Venenatis aliqua.</p>
                            </div>
                            <div className='other-news'>
                                <div className='other-news-head'>
                                    <span>Tin khác</span>
                                </div>
                                <div className='news-list other-news-content'>
                                    <div className='news-content other-news-content'>
                                        <img style={{ width: '30%' }} src={fadeImages[0]}></img>
                                        <div className='news-right-content'>
                                            <div className='news-right-content-header'>
                                                <span>Sapiente aliquip hendrerit sed porttitor.</span>
                                            </div>
                                            <div className='news-right-content-content other-news-content-summary'>
                                                <span>Quas proin molestias pharetra debitis ut hymenaeos consequuntur. Consequuntur! Quaera
                                    t imperdiet ex, quae facilis imperdiet eaque voluptatum sollicitudin esse! Numquam.</span>
                                            </div>
                                            <div className='news-right-content-time other-news-content-time'>
                                                <span><i className="far fa-clock"></i>&nbsp;18 : 10 | Thứ 7, 20-1-2018</span>
                                            </div>
                                        </div>
                                    </div>
                                   
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

export default NewsContent