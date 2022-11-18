## 1.0.14
2022/9/19
1. Sync develop to master;
2. Set readme for detail;
3. This release is to get ready for the new VC flow.

## 1.0.15
2022/11/7
1. set mailer to outlook365;
2. unify the app.config;

## 1.0.16

## 1.0.17
`2022/11/18`
1. drop egg-mongoose;
2. import mongoose;
3. use DB_HOST, drop DB_IP;

### How to get the DB_HOST
```
$ mongo
rs0> rs.conf()
# vim /etc/hosts
xxx.xxx.xxx.xxx DB_HOST
```