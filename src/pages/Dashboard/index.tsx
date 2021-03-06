import React, {useState, useEffect, FormEvent} from 'react';
import {FiChevronRight} from 'react-icons/fi'
import { Link }  from 'react-router-dom'
import { Title, Form, Repositories, Error } from './styles';
import logo from '../../assets/logo.svg';
import api from '../../services/api';


interface Repository{
    full_name: string;
    description:string;
    owner:{
        login:string;
        avatar_url:string;
    };
}

 const Dashboard: React.FC= () => {
    const [newRepo, setNewRepo]= useState('');
    const [inputError, setInputError]= useState('');

    const [repositories, setRepositories] = useState<Repository[]>(()=> {
        const storagedRepositories = localStorage.
            getItem('@GithubExplorer:repositories');
        
        if(storagedRepositories){
            return JSON.parse(storagedRepositories);
        }else{
            return[];
        }
    });

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', 
            JSON.stringify(repositories)
        );
    }, [repositories])

   async function handleAddRepository(event: FormEvent<HTMLFormElement>):
   Promise<void>{
        event.preventDefault();
    
        if(!newRepo){
            setInputError('Digite o autor/nome do repositorio');
            return;

        }         
        try {
            const response = await api.get<Repository>(`repos/${newRepo}`);

            const repository = response.data;

            setRepositories([...repositories, repository]);
            setNewRepo('');
            setInputError('');
        } catch (error) {
            setInputError('Erro na busca do repositorio');
        }          
    }

    return(
    <>
        <img src={logo} alt="Github Explore"/>
        <Title>Explore repositorios no GitHub</Title>

        <Form hasError={!! inputError} onSubmit={handleAddRepository}>
            <input 
                type="text" 
                placeholder="Digite aqui o nome do repositorio"
                value={newRepo}
                onChange={(e) => setNewRepo(e.target.value)}
                
            />
            <button type="submit">Pesquisar</button>
        </Form>

        {inputError && <Error>{inputError}</Error> }

        <Repositories>
            {repositories.map(repository =>(
                <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
                <img src={repository.owner.avatar_url}
                alt={repository.owner.login}> 
                </img>

                <div>
                    <strong>{repository.full_name}</strong>
                    <p>{repository.description}</p>
                </div>

                <FiChevronRight size={20}></FiChevronRight>
                </Link>

            ))}


        </Repositories>
    </>
    );
 };

 export default Dashboard;