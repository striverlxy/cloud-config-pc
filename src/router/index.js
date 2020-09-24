import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import routerConfig from './config'

import LoadingPage from '../components/loadingPage'
import styles from './style.less'
 
const renderRouter = routes => {
    if (!Array.isArray(routes)) {
        return null;
    }

    return (
        <Switch>
            {
                routes.map((route, index) => {
                    if (route.redirect) {
                        return (
                            <Redirect 
                                key={route.path || index}
                                exact={route.exact}
                                from={route.from}
                                to={route.redirect}
                            />
                        )
                    }

                    return (
                        <Route
                            path={route.path} 
                            key={route.path || index}
                            exact={route.exact}
                            render={() => {
                                const renderChildren = renderRouter(route.children)
                                if (route.component) {
                                    return (
                                        <Suspense fallback={<LoadingPage />}>
                                            <div className={styles.animation_route}>
                                                <route.component route={route}>{ renderChildren }</route.component>
                                            </div>
                                        </Suspense>
                                    )
                                }
                                return renderChildren
                            }}
                        />
                    )
                })
            }
        </Switch>
    )
}

const AppRouter = () => {
    return (
        <Router>{ renderRouter(routerConfig) }</Router>
    )
}

export default AppRouter