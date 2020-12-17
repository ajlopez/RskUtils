# RSK Private Network Config Generator

Generate config files for a private network. Tested with Bamboo release.

## Install

Install NodeJS

Run
```
npm install
```

The `java` launcher should be in your path.

## Configure

Edit the `config.json` to point to your local RSK full jar (this utility was tested using Bamboo release):

```
{
	"jar": "rskj.jar"
}
```

## Generate Configuration Files

Run
```
node genconf
```

It generates three config files in `build` folder (one miner, two not miners). You can specify the number and kind
of nodes:

```
node genconf -m 2 -n 3
```
or
```
node genconf -miners 2 -notminers 3
```


The above commands generate TWO miners and THREE not miners.

You can launch each node running in a terminal:
```
java -cp <rskjarfile> -Drsk.conf.file=build/nodexx.conf co.rsk.Start --regtest
```

where `xx` is the number of node to launch (starting with 1).

Or you can run in a terminal:
```
node run <number>
```

Sample, starting the first node:
```
node run 1
```

Each node has a different RPC port starting with `4444`.

You can check the status of the node using [https://github.com/ajlopez/RskApi/tree/master/samples/simple](https://github.com/ajlopez/RskApi/tree/master/samples/simple):

```
node getaccounts http://localhost:4444
node getaccounts http://localhost:4445
node getpeers http://localhost:4444
node getpeers http://localhost:4445

```

The `getpeers` command helps to assure the nodes are
interconnected






