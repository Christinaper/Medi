import style from './LazyLoading.module.css'
import loading from '../../assets/images/loading.gif'
function LazyLoading() {
  return (
      <div className={style['container']}>
        <div className={style['img-box']}>
          <img src={loading} alt="Loading" className={style['loading-img']} />
        </div>
        
      </div>
  )
}
export default LazyLoading;