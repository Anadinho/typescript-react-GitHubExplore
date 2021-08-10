import React, {useEffect, useState} from 'react';
import {useRouteMatch, Link} from 'react-router-dom'
import api from '../../services/api';
import { Header, RepositoryInfo, Issues }  from './styles';
import logo from '../../assets/logo.svg';
import {FiChevronLeft, FiChevronRight} from 'react-icons/fi'

interface RepositoryParams{
   repository: string;
}

interface Repository{
   full_name: string;
   description:string;
   stargazers_count: number;
   forks_count: number;
   open_issues_count:number;
   owner:{
       login:string;
       avatar_url:string;
   };
}

interface Issue{
   id:number;
   title: string;
   html_url:string;
   user:{
      login:string;
   }
   
}

const Repository: React.FC= () => {
   const [repository, setRepository] = useState<Repository | null>(null);
   const[issues, setIssues] = useState<Issue[]>([]);

   const { params } = useRouteMatch<RepositoryParams>();

   useEffect(() => {
      api.get(`repos/${params.repository}`).then(response => {
         // console.log(response.data);
         setRepository(response.data);
      });

      api.get(`repos/${params.repository}/issues`).then(response => {
         // console.log(response.data);
         setIssues(response.data);
      });
   }, [params.repository]);


   return(
      <>
         <Header>
            <img src={logo} alt="Github Explore"></img>
            <Link to="/"> 
               <FiChevronLeft size={16}/>
               Voltar
            </Link>
         </Header>

         {repository && (
            <RepositoryInfo>
            <header>
               <img src={repository.owner.avatar_url} alt={repository.owner.login} />
               <div>
                  <strong>{repository.full_name}</strong>
               </div>
            </header>

            <ul>
               <li>
                  <strong>{repository.stargazers_count}</strong>
                  <span>Issues abertos</span>
               </li>

               <li>
                  <strong>{repository.forks_count}</strong>
                  <span>Forks</span>
               </li>

               <li>
                  <strong>{repository.open_issues_count}</strong>
                  <span>Issues abertas</span>
               </li>
            </ul>

         </RepositoryInfo>
         )}

         <Issues>
            {issues.map(issue => (
               <a key={issue.id}  href={issue.html_url}>
                  <div>
                     <strong>{issue.title}</strong>
                     <p>{issue.user.login}</p>
                  </div>

                  <FiChevronRight size={20}></FiChevronRight>
               </a>
            ))}
         </Issues>
      </>
   );

};

export default Repository;