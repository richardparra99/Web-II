import { FormControl } from 'react-bootstrap';
import lupa from '../assets/lupa.png'

const SearchTextField = ({ texto, className}) => {
    return (
        <div className={`search-text-field ${className}`}>
            <FormControl type="text" placeholder="Buscar" value={texto}/>
            <img src={lupa} alt="buscar" />
        </div>
    );
}
 
export default SearchTextField;